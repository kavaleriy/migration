class AddIndexToHousing < ActiveRecord::Migration
  def change
    add_index :housings, [:koatuu_code, :type_id], :unique=>true
  end
end
