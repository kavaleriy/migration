class Area < ActiveRecord::Base
  has_many :housings, dependent: :destroy
end
