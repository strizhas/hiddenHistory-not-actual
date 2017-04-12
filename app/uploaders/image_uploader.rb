# encoding: utf-8

class ImageUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  include CarrierWave::MiniMagick

  before :cache, :setup_available_sizes

  # Choose what kind of storage to use for this uploader:
  storage :aws
  # storage :fog

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   # For Rails 3.1+ asset pipeline compatibility:
  #   # ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  #
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Process files as they are uploaded:
  # process :scale => [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  # this method called from resourse model
  def dynamic_resize_and_crop( size )
    manipulate! do |img|
     
        if model.crop_w != nil && model.crop_h != nil 
          x = model.crop_x
          y = model.crop_y
          w = model.crop_w
          h = model.crop_h

          # по неустановленной причине в params вместо значения w
          # попадает строка вида wXwXW
          # Пока я не установил причину используем такой костыль
          w = w.split('X')[0]

          crop_size = w << 'x' << h
          offset = '+' << x << '+' << y 

          img.crop("#{crop_size}#{offset}")
        end   

        img
        
      end



      max_width = model.class::IMAGE_SIZES[size][0]
      max_height = model.class::IMAGE_SIZES[size][0]

      resize_to_fill( max_width , max_height )

  end

  def resize_original
    resize_to_limit(1200,1000)
  end

  version :big, :if => :has_big_size? do
    process :dynamic_resize_to_limit => :big
  end

  version :thumb, :if => :has_thumb_size? do 
    process :dynamic_resize_and_crop => :thumb
  end

  version :icon, :if => :has_icon_size? do
    process :dynamic_resize_and_crop => :icon
  end


  # a lame wrappers to different resize methods
  def dynamic_resize_to_fit(size)
    resize_to_fit *(model.class::IMAGE_SIZES[size])
  end

  def dynamic_resize_to_fill(size)
    resize_to_fill *(model.class::IMAGE_SIZES[size])
  end

  def dynamic_resize_to_limit(size)
    resize_to_limit *(model.class::IMAGE_SIZES[size])
  end

  def method_missing(method, *args)
    # we've already defined "has_VERSION_size?", so if a method with
    # similar name is missed, it should return false
    return false if method.to_s.match(/has_(.*)_size\?/)
    super
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_white_list
    %w(jpg jpeg gif png)
  end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  # def filename
  #   "something.jpg" if original_filename
  # end

  protected
  # the method called at the start
  # it checks for <model>::IMAGE_SIZES hash and define a custom method "has_VERSION_size?"
  # (more on this later in the article)
  def setup_available_sizes(file)
    model.class::IMAGE_SIZES.keys.each do |key|
      self.class_eval do
        define_method("has_#{key}_size?".to_sym) {|file| true }
      end
    end
  end


end
