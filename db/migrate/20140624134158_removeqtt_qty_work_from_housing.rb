class RemoveqttQtyWorkFromHousing < ActiveRecord::Migration
  def change
    remove_column :housings, :qty_work
  end
end
