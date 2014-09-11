class CreateAdvertWorks < ActiveRecord::Migration
  def change
    create_table :advert_works do |t|
      t.integer :advert_id

      t.string :rubric
      t.integer :places
      t.integer :salary

      t.timestamps
    end
  end
end
