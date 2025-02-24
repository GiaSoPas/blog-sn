import React, { useEffect, useState } from 'react'
import { Button, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEditAllow } from '../hooks/useEditAllow';
import { formatDate } from '../utils';

const CommentItem = ({ comment, onCommentDelete }) => {

	const { user } = useAuth();

	const navigate = useNavigate();
	const location = useLocation();
	const subtitleFontSize = '12px';

	const [publishedDate, setPublishedDate] = useState('');

	useEffect(() => {
		const formattedDate = formatDate(comment.createdDate);
		setPublishedDate(formattedDate);
	}, [comment]);

	const isEditAllowed = useEditAllow(comment);


	const handleDeleting = (e) => {
		e.preventDefault();
		if (isEditAllowed) {
			onCommentDelete(comment.id);
		}
	}

	return (
		<>
			<Card className='m-1 mb-3'>
				<Card.Header className='d-flex justify-content-between'>
					<div >
						<Card.Subtitle
							className="m-2 text-muted text-sm-left s"
							style={{ cursor: "pointer", fontSize: subtitleFontSize }}
							onClick={() => navigate(`/users/${comment.applicationUserId}`, {
								state: { from: location }
							})}
						>
							Автор: {comment.applicationUser ? comment.applicationUser.userName : 'Нет автора'}
						</Card.Subtitle>
						<Card.Subtitle
							className="mb-2 text-muted"
							style={{ fontSize: subtitleFontSize }}
						>
							Опубликовано:
							{' ' + publishedDate}
						</Card.Subtitle>
					</div>
					<div className='m-2'>
						{
							isEditAllowed &&
							<>
								<Button
									variant='outline-danger'
									onClick={handleDeleting}
								>
									Удалить
								</Button>
							</>
						}
					</div>
				</Card.Header>
				<Card.Body>
					<Card.Text>{comment.content}</Card.Text>
				</Card.Body>
			</Card>
		</>
	);
}

export default CommentItem