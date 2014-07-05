class DeleteTrudCodeFromWorkplaces < ActiveRecord::Migration
  def change
    remove_column :workplaces, :trud_code
  end
end
