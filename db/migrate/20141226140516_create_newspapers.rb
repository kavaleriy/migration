class CreateNewspapers < ActiveRecord::Migration
  def change
    create_table :newspapers do |t|
      t.text :embed

      t.timestamps
    end
  end
end
