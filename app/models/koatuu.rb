class Koatuu < ActiveRecord::Base
  def self.get_by_code(code)
    where(:code => code).first
  end

  def self.level(level, code = '')
    self.where(:level => level).where("code like ?", "#{code}%")
  end

  def self.l1(code = '')
    self.level(1, code).order('name')
  end
  def self.l2(code = '')
    self.level([13, 3, 2], code).order('name')
  end

  def self.areas(code = '')
    self.level(1, code).order('name')
  end
  def self.regions(code = '')
    self.level(2, code).order('name')
  end
  def self.acities(code = '')
    self.level(13, code).order('name')
  end
  def self.cities(code = '')
    self.level([3, 31], code).order('name')
  end

  def self.to_tree(code)
    tree = []

    areas(code).each { |area|
      l1 = area.code.slice(0, 2)

      tree_regions = []
      acity = acities(l1).first
      tree_regions << [ acity.name, acity.code ] unless acity.nil?
      l2(l1).each do |region|
        tree_regions << [ region.name, region.code]
      end

      tree << [ area.name, tree_regions]
    } if !code.nil?

    tree
  end

  def self.coatuu_to_json(code)
    l1 = code.slice(0, 2).ljust(10, '0')
    l2 = code.slice(0, 5).ljust(10, '0')
    l3 = code.rjust(10, '0')

    area = get_by_code(l1)
    region = get_by_code(l2)
    name = get_by_code(l3)

    coatuu = { id: code, name: name.name } if name
    coatuu[:area] = area.name if area
    coatuu[:region] = region.name if region

    coatuu
  end

  def self.areas_to_json(filter = '')
    filter = filter.mb_chars
    arr = []
    areas.where("name like ?", "%#{filter}%").each { |area|
      arr << { name: area.name, id: area.code }
    }
    arr
  end

  def self.regions_to_json(area, filter = '')
    filter = filter.mb_chars
    arr = []

    l2(area.slice(0,2)).where("name like ?", "%#{filter}%").each do |region|
      arr << { name: region.name, id: region.code }
    end if area.length >= 2

    arr
  end

  def self.acities_to_json(area, filter = '')
    filter = filter.mb_chars
    arr = []

    acities(area.slice(0,2)).where("name like ?", "%#{filter}%").each do |city|
      arr << { name: city.name, id: city.code }
    end if area.length >= 2

    arr
  end

  # def self.get_area_tree(code, filter)
  #   tree = []
  #
  #   if code.length == 2
  #     areas(code).each { |area|
  #
  #       l1 = area.code.slice(0, 2)
  #       tree_regions = []
  #       regions(l1).each do |region|
  #         l2 = region.code.slice(0,5)
  #         tree_cities = []
  #         cities(l2).where("name like '%#{filter}%'").each do |city|
  #           tree_cities << { name: city.name, id: city.code }
  #         end
  #         tree_regions << { name: extract_name(region.name), id: l2, children: tree_cities } if not tree_cities.empty?
  #       end
  #       acity = cities("#{l1}10100000").where("name like '%#{filter}%'").first
  #       if acity
  #         tree << { name: acity.name, id: acity.code, children: tree_regions }
  #       else
  #         tree = tree_regions
  #       end
  #     }
  #   end
  #   tree
  # end

end
