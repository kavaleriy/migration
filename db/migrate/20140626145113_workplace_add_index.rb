class WorkplaceAddIndex < ActiveRecord::Migration
  def change
    add_index :workplaces, [:koatuu_code, :rubric], name: "index_workplaces_on_koatuu_code_and_rubric", unique: true
  end
end
