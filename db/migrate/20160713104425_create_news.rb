class CreateNews < ActiveRecord::Migration
  def change
    create_table :news do |t|
      t.string :title,  null: false
      t.text :intro,    null: false
      t.text :text
      t.integer :user_id, null: false, default: 1
      t.string :image
      t.integer :era
      t.string :parent
      t.boolean :published, default: false, null: false

      t.timestamps null: false
    end
  end
end
