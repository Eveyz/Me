class Case < ApplicationRecord
  belongs_to :personnel

  validates :personnel_id, presence: true
  # validates :start, presence: true
  validates :c1, presence: true
  validates :c2, presence: true

  def personnel_name
    Personnel.find(self.personnel_id).name
  end

end
