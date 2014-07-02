class CreateGeo < ActiveRecord::Migration
  def change
    create_table :geos do |t|
      t.string  :koatuu_code
      t.decimal :lon, :precision => 15, :scale => 10
      t.decimal :lat, :precision => 15, :scale => 10
      t.integer :zoom
    end
  end
end
