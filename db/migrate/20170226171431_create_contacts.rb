class CreateContacts < ActiveRecord::Migration[5.0]
  def change
    create_table :contacts do |t|
      t.string :sender
      t.string :receiver
      t.string :contact_type
      t.boolean :legal

      t.timestamps
    end
  end
end
