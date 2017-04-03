module BuildingsHelper

	def build_basic_info
		html = '<div id="building-basic-info">'
		html += '<p>текущий статус: <span>' << Building::STATUSES['ru'][@building.status] << '</span></p>'
		html += '<p>тип сооружения: <span>' << @category.title << '</span></p>'
		html += '</div>'

		return html.html_safe
	end
end
