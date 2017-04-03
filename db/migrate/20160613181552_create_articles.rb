class CreateArticles < ActiveRecord::Migration
  def change
    create_table :articles do |t|
      t.string  :title,  null: false
      t.text    :text,   null: false
      t.string  :image
      t.string  :intro,  null: false
  	  t.integer	:user_id, null: false, default: 1
  	  t.integer :era
  	  t.integer :category_id
      t.boolean :published, default: false, null: false

      t.timestamps null: false
    end
  end
end
