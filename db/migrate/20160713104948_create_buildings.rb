class CreateBuildings < ActiveRecord::Migration
  def change
    create_table :buildings do |t|
      t.string  :title, null: false
      t.text    :intro, null: false
      t.text    :text
      t.string  :image
      t.integer :era
      t.integer :ruined
      t.integer :abandoned
      t.integer :category_id
      t.integer :building_id
      t.integer :user_id, null: false, default: 1
      t.decimal :latitude
      t.decimal :longitude
      t.integer :status,  null: false
      t.integer :model3d_id,  null: false, default: false
      t.boolean :underground, null: false, default: false
      t.boolean :published, null: false, default: false

      t.timestamps null: false
    end
  end
end
