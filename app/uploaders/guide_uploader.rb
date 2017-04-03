# encoding: utf-8

class GuideUploader < ImageUploader

  def resize_original
    resize_to_limit(350,200)
  end


end
