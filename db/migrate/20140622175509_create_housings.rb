class CreateHousings < ActiveRecord::Migration
  def change
    create_table :housings do |t|
      t.integer :area_id
      t.integer :type_id
      t.integer :qty_places
      t.integer :qty_work
      t.integer :has_school
      t.integer :has_kgarden

      t.timestamps
    end
  end
end
