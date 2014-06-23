class Region < ActiveRecord::Base
  belongs_to :area
  has_many :cities

  default_scope -> { order('name DESC') }
  validates :area_id, presence: true
end
