class NewsItemAddBoost < ActiveRecord::Migration
  def change
    add_column :news_items, :boost, :integer
  end
end
