class CreateCases < ActiveRecord::Migration[5.0]
  def change
    create_table :cases do |t|
      t.references :personnel, foreign_key: true
      t.timestamp :start
      t.timestamp :completion
      t.string :c1
      t.string :c2

      t.timestamps
    end
  end
end
