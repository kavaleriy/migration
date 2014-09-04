module AdvertsHelper
  def get_koatuu_tree
    koatuu_tree = Rails.cache.read('koatuu_tree')
    if koatuu_tree.nil?
      koatuu_tree = Koatuu.to_tree
      Rails.cache.write('koatuu_tree', koatuu_tree, timeToLive: (30 * 60).seconds)
    end
    koatuu_tree
  end
end
