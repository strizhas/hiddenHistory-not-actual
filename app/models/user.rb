class User < ActiveRecord::Base
  
  has_many :comments
  has_many :buildings
  has_many :articles
  has_many :schemas
  has_many :photos
  has_many :guides
  has_many :photo_markers
  has_many :guide_markers

  IMAGE_SIZES = {
      :thumb => [300,300],
      :icon  => [28, 28]
   }

  mount_uploader :image, ImageUploader

  # User::Roles
  # The available roles
  Roles = [ :admin , :member, :article_editor, :buildings_editor ]


  attr_accessor :password, :crop_x, :crop_y, :crop_w, :crop_h 

  before_save :encrypt_password
  after_save :clear_password

  after_update :generate_thumbnails

  EMAIL_REGEX = /\b[A-Z0-9._%a-z\-]+@(?:[A-Z0-9a-z\-]+\.)+[A-Za-z]{2,4}\z/i
  
  validates :username, :presence => true, :uniqueness => true, :length => { :in => 3..20 }
  validates :email, :presence => true, :uniqueness => true, :format => EMAIL_REGEX
  validates :password, :confirmation => true
  
  #Only on Create so other actions like update password attribute can be nil
  validates_length_of :password, :in => 6..20, :on => :create


  # check user role
  def is?( requested_role )
    self.role == requested_role.to_s
  end 

  def self.authenticate(username_or_email="", login_password="")

    if  EMAIL_REGEX.match(username_or_email)    
      user = User.find_by_email(username_or_email)
    else
      user = User.find_by_username(username_or_email)
    end

    if user && user.match_password(login_password)
      return user
    else
      return false
    end
  end   

  def match_password(login_password="")
    encrypted_password == BCrypt::Engine.hash_secret(login_password, salt)
  end

  def encrypt_password
    unless password.blank?
      self.salt = BCrypt::Engine.generate_salt
      self.encrypted_password = BCrypt::Engine.hash_secret(password, salt)
    end
  end

  def clear_password
    self.password = nil
  end

  # cropping user profile image after creating new profile or updating current  
  def generate_thumbnails
      image.recreate_versions! if image.present?
  end

end