class AddCounterCache < ActiveRecord::Migration[5.0]
  def change
  	add_column :buildings, :photos_count, :integer, :default => 0
    Building.reset_column_information
    Building.all.each do |r| 
      Building.update_counters r.id, :photos_count => r.photos.count
    end

    add_column :buildings, :schemas_count, :integer, :default => 0
    Building.reset_column_information
    Building.all.each do |r| 
      Building.update_counters r.id, :schemas_count => r.schemas.count
    end

    add_column :users, :comments_count, :integer, :default => 0
    User.reset_column_information
    User.all.each do |r| 
      User.update_counters r.id, :comments_count => r.comments.count
    end

    add_column :users, :photos_count, :integer, :default => 0
    User.reset_column_information
    User.all.each do |r| 
      User.update_counters r.id, :photos_count => r.photos.count
    end

    add_column :users, :buildings_count, :integer, :default => 0
    User.reset_column_information
    User.all.each do |r| 
      User.update_counters r.id, :buildings_count => r.buildings.count
    end

    add_column :users, :articles_count, :integer, :default => 0
    User.reset_column_information
    User.all.each do |r| 
      User.update_counters r.id, :articles_count => r.articles.count
    end

    add_column :users, :photo_markers_count, :integer, :default => 0
    User.reset_column_information
    User.all.each do |r| 
      User.update_counters r.id, :photo_markers_count => r.photo_markers.count
    end

    add_column :users, :guide_markers_count, :integer, :default => 0
    User.reset_column_information
    User.all.each do |r| 
      User.update_counters r.id, :guide_markers_count => r.guide_markers.count
    end

  end
end
