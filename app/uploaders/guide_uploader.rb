# encoding: utf-8

class GuideUploader < ImageUploader

  def resize_original
    resize_to_limit(800,600)
  end


end
