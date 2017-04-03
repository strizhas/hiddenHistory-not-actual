class CreateGuides < ActiveRecord::Migration[5.0]
  def change
    create_table :guides do |t|
      t.string :title
      t.text   :text
      t.string :image
      t.integer :schema_id
      t.integer :user_id
      t.string :url

      t.timestamps
    end
  end
end
