module ShemaHelper
	def inline_svg(path)

		require 'open-uri'

    	svg = load_data(path)

    	encoded_svg = svg.force_encoding("UTF-8")

    	return encoded_svg

	end

	private

		def load_data(path)
			open("#{path}", "rb") do |file|
    			raw file.read
  			end
		end
end
