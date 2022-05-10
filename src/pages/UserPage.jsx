import React, { useState, useEffect } from 'react'
import { Card, Container, Image, Modal, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import PostList from '../components/PostList';
import { useFetching } from '../hooks/useFetching';
import AllPostsPage from './AllPostsPage';
import { CreatePostForm } from '../components/CreatePostForm';
import AuthService from '../api/AuthService';
import { useAuth } from '../hooks/useAuth';
import UserService from '../api/UserService';


const UserPage = () => {

	const params = useParams();

	const [pageUser, setPageUser] = useState({ userName: '' });
	const [posts, setPosts] = useState([]);

	const [fetchUser] = useFetching(async (id) => {
		const response = await UserService.getById(id);
		setPageUser(response.data);
	})

	const [fetchPosts] = useFetching(async (id) => {
		const response = await UserService.getPostsByUserId(id);
		setPosts(response.data);
	})
	//
	useEffect(() => {
		const fetchAPI = async () => {
			await fetchUser(params.id);
			await fetchPosts(params.id);
		}
		fetchAPI();
		console.log(pageUser);
	}, [params.id]);


	return (
		<>

			<Container className='d-flex'>
				<Card style={{ width: '36.8rem', height: '32rem', top: '1rem' }} className='justify-content-center'>
					<Card.Img style={{ height: '15rem', width: '16.87rem' }}
						variant="top"
						src="https://4kwallpapers.com/images/wallpapers/mount-cook-new-zealand-aoraki-national-park-mountain-peak-5120x3200-3913.jpg" />
					<Card.Body>
						<div className='d-flex justify-content-center'>
							<h2>{pageUser.userName}</h2>
						</div>
						<div className='d-flex justify-content-center'>
							<h6>Developer stream bla bla</h6>
						</div>
						<br />
						<br />
						<br />
						<br />
						<br />
						<div className='d-flex justify-content-center' >
							<Card className='App justify-content-center'
								style={{ margin: '0,9rem', height: '5rem', width: '5rem' }}>
								<h6>Posts</h6>
								<h8>{posts.length}</h8>
							</Card>
							<hr />
							<Card className='App justify-content-center'
								style={{ margin: '0,9rem', height: '5rem', width: '5rem' }}>
								<h6>Followers</h6>
								<h8>Count</h8>
							</Card>
							<hr />
							<Card className='App justify-content-center'
								style={{ margin: '0,9rem', height: '5rem', width: '5rem' }}>
								<h6>Following</h6>
								<h8>Count</h8>
							</Card>
						</div>
					</Card.Body>
				</Card>
				<Card style={{ width: '50rem', top: '1rem', marginLeft: '3rem' }}>
					<Card.Header className='d-flex'>
						<h2>User Posts</h2>
					</Card.Header>
					<Card.Body>
						<PostList posts={posts} />
					</Card.Body>
				</Card>

			</Container>
		</>
	)
	}

	export default UserPage