class Housing < ActiveRecord::Base
  belongs_to :area
  belongs_to :type

  default_scope -> { order('created_at DESC') }
  validates :area_id, presence: true
  validates :type_id, presence: true
end
