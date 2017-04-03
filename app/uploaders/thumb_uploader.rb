# encoding: utf-8

class ThumbUploader < ImageUploader

  after :store, :remove_original_file

  def remove_original_file(p)
    if self.version_name.nil?
      self.file.delete if self.file.exists?
    end
  end

end
