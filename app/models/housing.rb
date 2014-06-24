class Housing < ActiveRecord::Base
  belongs_to :type

  default_scope -> { order('koatuu_code DESC') }
  validates :koatuu_code, presence: true
  validates :type_id, presence: true
end
