class Koatuu < ActiveRecord::Base
  def self.area(code)
    l1 = code.slice(0,2)
    areas(l1).first if l1.length == 2
  end

  def self.region(code)
    l2 = code.slice(0,5)
    regions(l2).first if l2.length == 5
  end

  def self.city(code)
    cities(code).first if code.length == 10
  end

  def self.areas(area = '')
    self.where(:level => 1).where("code like '#{area}%'").order('name')
  end
  def self.regions(region = '')
    self.where(:level => 2).where("code like '#{region}%'").order('name')
  end
  def self.cities(code = '')
    self.where(:level => 3).where("code like '#{code}%'").order('name')
  end

  def self.to_tree(code)
    tree = []

    areas(code).each { |area|
      l1 = area.code.slice(0, 2)
      tree_regions = []
      regions(l1).each do |region|
        tree_regions << [ region.name, region.code]
      end

      tree << [ area.name, tree_regions]
    } if !code.nil?

    tree
  end

  def self.coatuu_to_json(code)
    area = area(code)
    region = region(code)
    city = city(code)

    coatuu = {}
    coatuu[:area] = area.name if area
    coatuu[:region] = region.name if region
    coatuu[:city] = city.name if city

    coatuu
  end

  def self.areas_to_json(filter = '')
    filter = filter.mb_chars.upcase
    arr = []
    areas.where("name like '%#{filter}%'").each { |area|
      arr << { name: area.name, id: area.code }
    }
    arr
  end

  def self.regions_to_json(area, filter = '')
    filter = filter.mb_chars.upcase
    tree = []

    regions(area.slice(0,2)).where("name like '%#{filter}%'").each do |region|
      name = region.name
      tree << { name: name, id: region.code }
    end if area.length >= 2

    tree
  end

  def self.extract_name name
    index = name.index('/')
    name = name.slice(0, index) if index
    name.mb_chars.gsub(/ ОБЛАСТЬ$/, '').gsub(/ РАЙОН$/, '').capitalize
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
