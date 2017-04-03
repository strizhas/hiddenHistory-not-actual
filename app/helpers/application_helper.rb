module ApplicationHelper
	def kramdown(text)
  		return sanitize Kramdown::Document.new(text).to_html
	end

	def build_category_tree
		$html = ''
		parent_categories = @categories.find_all { |category| category.parent_category_type == current_model }

		# level - deepnes of current subcategories list
		def create_categories_html(categories, level)
			$html += '<ul class="sidebar-nav-level-' << level.to_s << '">'
			categories.each do |category|
				$html += "<li>"

				inner_cont = ( '<span>' + category.title + '</span>' ).html_safe
				$html += ( link_to inner_cont, { :action => :index, :category_id => category.id }, :class => 'remote-link' )




					if category.categories.count > 0
						create_categories_html(category.categories, level + 1)
					end

				$html += "</li>"
			end
			$html += "</ul>"
		end

		create_categories_html(parent_categories, 0 )
		return $html.html_safe
	end

	

end
