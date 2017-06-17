class UserMailer < ApplicationMailer

	default from: 'hiddenhistory.mail@gmail.com'
 
	def welcome_email(user)
		@user  = user
		mail(to: @user.email,  subject: 'регистрация на сайте hiddenHistory')

		welcome_mail_admin(@user).deliver_later
	end

	def welcome_mail_admin(user)
		@user = user
		@admin = User.find(1)
		mail(to: @admin.email, subject: 'зарегестрирован новый пользователь')
	end

	def comment_notification(comment, commentable)

		@comment = comment
		@commentable = commentable




		if @comment.commentable_type == 'Photo'
			@parent = Building.select([:id]).find( @commentable.building_id )
		end

		if @comment.commentable_type == 'Guide'
			@parent = Guide.select([:id]).find( @commentable.guide_id )
		end

		@user = User.find( @commentable.user_id )

		mail(to: @user.email, subject: 'Добавлен новый комментарий')
	end

end
