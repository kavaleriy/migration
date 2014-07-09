class NewsItem < ActiveRecord::Base
  default_scope -> { order('boost desc, created_at desc') }
end
