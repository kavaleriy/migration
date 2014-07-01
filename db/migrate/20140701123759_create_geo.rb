class CreateGeo < ActiveRecord::Migration
  def change
    create_table :geos do |t|
      t.string  :koatuu_code
      t.integer :lon
      t.integer :lat
      t.integer :zoom
    end
  end
end
