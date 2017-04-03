class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.string   :image, null: false
      t.text     :text
      t.text     :alt
      t.integer  :user_id, null: false, default: 1
      t.string   :author
      t.integer  :building_id
      t.integer  :schema_id
      t.boolean  :published
      t.integer  :year
      t.integer  :likes, null: false , default: 0

      t.timestamps null: false
    end
  end
end
