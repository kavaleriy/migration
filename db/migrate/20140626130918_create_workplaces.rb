class CreateWorkplaces < ActiveRecord::Migration
  def change
    create_table :workplaces do |t|
      t.string :koatuu_code
      t.string :rubric
      t.integer :places
      t.string :trud_code

      t.timestamps
    end
  end
end
