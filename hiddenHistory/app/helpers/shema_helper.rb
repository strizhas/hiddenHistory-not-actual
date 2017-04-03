module ShemaHelper
	def inline_svg(path)
    	File.open("public/#{path}", "rb") do |file|
    	raw file.read
  		end
	end
end
