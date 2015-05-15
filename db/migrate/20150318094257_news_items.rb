class NewsItems < ActiveRecord::Migration
  def change
    add_column :news_items, :page, :string
  end
end
