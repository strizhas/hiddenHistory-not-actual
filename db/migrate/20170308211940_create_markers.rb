class CreateMarkers < ActiveRecord::Migration
  def change
    create_table :markers do |t|
      t.integer :markerable_id
      t.string  :markerable_type
      t.integer :coord_x
      t.integer :coord_y
      t.integer :angle
      t.integer :year
      t.boolean :published
      t.integer :schema_id
      
      t.timestamps
    end
  end
end
