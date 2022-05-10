import React, { useContext, useEffect, useState } from "react";
import PostsService from "../api/PostsService";
import { useFetching } from "../hooks/useFetching";
import Loader from "../components/Loader";
import CommentList from "../components/CommentList";
import { Card, Button, Modal } from "react-bootstrap";
import { formatDate } from "../utils";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context";
import EditPostForm from "../components/EditPostForm";
import CommentBlock from "../components/CommentBlock";

const PostPage = () => {

	const { user } = useContext(AuthContext);
	const params = useParams();

	const [categories, setCategories] = useState([])
	const [post, setPost] = useState({});
	const subtitleFontSize = '14px';

	const [showEditPostModal, setShowEditPostModal] = useState(false);
	const handleEditPostModalClose = () => setShowEditPostModal(false);
	const handleEditPostModalOpen = () => setShowEditPostModal(true);

	const [fetchPost, isPostLoading, postError] = useFetching(async (id) => {
		const response = await PostsService.getById(id);
		console.log("PostPage fetchPost response: ");
		console.log(response);
		setPost(response.data);
	})
	const [fetchCategories, isCategoriesLoading, categoriesError] = useFetching(async () => {
		const response = await PostsService.getAllCategories();
		setCategories(response.data);
	})

	const [deletePost, isDeleteLoading, deleteError] = useFetching(async (id) => {
		const response = await PostsService.deletePost(id);
		console.log('PostPage delete post response:');
		console.log(response);
	})
	useEffect(() => {
		const fetchAPI = async () => {
			await fetchCategories();
			await fetchPost(params.id);
		};
		fetchAPI();
	}, []);

	const handleDelete = async () => {
		if ((user.role === 'Moderator'
			|| user.role === 'Admin'
			|| user.id === post.applicationUserId)
			&& post) {
			await deletePost(post.id);
		}
	}

	const [isEditAllowed, setIsEditAllowed] = useState(false);
	useEffect(() => {
		if (user !== null
			&& (user?.role === 'Moderator'
				|| user?.role === 'Admin'
				|| user?.id === post.applicationUserId)) {
			setIsEditAllowed(true);
		} else {
			setIsEditAllowed(false);
		}
	}, [post]);

	return (
		<>
			<Modal size='lg' show={showEditPostModal} onHide={handleEditPostModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>Создание новой записи</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<EditPostForm
						categories={categories}
						initPost={{
							id: post.id,
							applicationUserId: post.applicationUserId,
							categoryId: post.categoryId,
							title: post.title,
							content: post.content,
							dateCreated: post.dateCreated
						}}
						maxHeight={400}
					/>
				</Modal.Body>
			</Modal>
			{

				isPostLoading
					? <Loader />
					: <>
						<Card border='dark' className='m-3'>
							<Card.Header className="d-flex justify-content-between">
								<div>
									<Card.Subtitle
										className="m-2 text-muted"
										style={{ fontSize: subtitleFontSize }}
									>
										Автор: {post.applicationUser ? post.applicationUser.userName : 'Нет автора'}
									</Card.Subtitle>
									<Card.Subtitle
										className="m-2 text-muted"
										style={{ fontSize: subtitleFontSize }}
									>
										Опубликовано:
										{' ' + formatDate(post.dateCreated)}
									</Card.Subtitle>
								</div>
								{
									isEditAllowed &&
									<div className="mt-2">
										<Button
											className='m-1'
											variant="outline-warning"
											onClick={handleEditPostModalOpen}
										>
											Изменить
										</Button>
										<Button
											className='m-1'
											variant="outline-danger"
											onClick={handleDelete}
										>
											Удалить
										</Button>
									</div>
								}
							</Card.Header>
							<Card.Body>
								<h4>{post.title}</h4>
								{post.content}
							</Card.Body>
						</Card>
						<CommentBlock postId={post.id}/>
					</>
			}
		</>
	);
}

export default PostPage;