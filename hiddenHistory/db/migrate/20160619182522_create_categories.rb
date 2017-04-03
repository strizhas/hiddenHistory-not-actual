class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string  :title, null: false
      t.text 	:description
      t.integer :parent_category_id
      t.string  :parent_category_type
      t.string  :image

      t.timestamps null: false
    end
  end
end
