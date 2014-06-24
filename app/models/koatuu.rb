class Koatuu < ActiveRecord::Base
  default_scope -> { order('name') }

  def self.areas(area = '')
    self.where(:b3 => '0', :b6 => '0').where("code like '#{area}%'")
  end
  def self.regions(region = '')
    self.where(:b3 => %w{2 3}, :b6 => '0', ).where("code like '#{region}%' and not code like '%0000000'")
  end
  def self.cities(code = '')
    self.where(:note => %w{М Т}).where("code like '#{code}%'")
    # r2 = self.where(:b3 => %w{1 2}).where("code like '#{code}%'").where.not("code like '%0000'")
  end

  def self.get_by_code(code)

    l1 = code.slice(0,2)
    l2 = code.slice(0,5)

    area = (areas(l1).first) if l1.length == 2

    region = regions(l2).first  if l2.length == 5

    city = cities(code).first if code.length == 10

    {
        area: (area.name if area),
        region: (region.name if region),
        city: (city.name if city)
    }
  end

  def self.get_tree(code)
    tree = []
    areas(code).each do |area|
      l1 = area.code.slice(0,2)
      # acity = cities("#{l1}10100000").first
      tree_regions =  []
      # (tree_regions  << [ '-', [[ acity.name, acity.code ]] ]) if acity
      regions(l1).each do |region|
        # l2 = region.code.slice(0,5)
        # tree_cities = []
        # cities(l2).each do |city|
        #   tree_cities << [ city.name, city.code  ]
        # end
        tree_regions << [ region.name, region.code ]
      end

      tree << [ area.name, tree_regions]
    end

    tree
  end

end
