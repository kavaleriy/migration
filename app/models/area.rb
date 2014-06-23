class Area < ActiveRecord::Base
  has_many :regions
  has_many :housings
end
