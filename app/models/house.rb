class House < ActiveRecord::Base
  has_many :housings, dependent: :destroy
end
