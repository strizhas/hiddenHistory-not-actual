class CreateMarkers < ActiveRecord::Migration
  def change
    create_table :photo_markers do |t|
      t.integer :photo_id
      t.integer :coord_x
      t.integer :coord_y
      t.integer :angle, default: 0
      t.integer :year
      t.boolean :published
      t.integer :schema_id
      t.integer :user_id
      
      t.timestamps
    end

    create_table :guide_markers do |t|
      t.integer :guide_id
      t.integer :coord_x
      t.integer :coord_y
      t.integer :svg
      t.integer :year
      t.boolean :published
      t.integer :schema_id
      t.integer :user_id
      
      t.timestamps
    end

  end
end
