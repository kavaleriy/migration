class AddIndexToType < ActiveRecord::Migration
  def change
    add_index :types, [:name], :unique=>true
  end
end
