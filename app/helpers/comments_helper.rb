module CommentsHelper

	def user_role_indication(comment)
		if comment.user.present?
			case comment.user.role
				when 'admin'
					role = '<div class="content-editor">редакция</div>'
				when 'article_editor'
					role = '<div class="content-editor">редакция</div>'
				else
					role = '<div class="member-comment">участник</div>'
				end
		else 
			role = '<div class="guest-comment">гость</div>'
		end 

		return role.html_safe
	end

	def get_comment_parent( comment )
		comment_class = comment.commentable.class.to_s

		case comment_class
			when 'Photo'
				text = 'комментарий к фотографии '
				link = ''
			when 'Building'
				text = 'комментарий к сооружению '
				link = ( link_to comment.commentable.title.to_s, building_path(comment.commentable) )
			when 'Article'
				text = 'комментарий к статье '
				#link = 'articles/' + 
				link_to 'редактировать', articles_path(comment.commentable)
			when 'Comment'
				text = 'ответ на комментарий '
				link = ''
			else
				text = ''
				link = ''
		end

		return  ( text + link ).html_safe
	end

end
