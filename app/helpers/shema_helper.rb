module ShemaHelper


	def inline_svg(path)

		require 'open-uri'

		# метод используется для тестирования
		# svg = File.read('/Users/Ribizubi/Documents/hiddenhistory/public' + path.to_s).html_safe

		# в продакшене должно быть так
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
