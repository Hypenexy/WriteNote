using System;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace WriteNote
{
    public partial class Form2 : Form
    {
        public Form2()
        {
            InitializeComponent();
        }

        private void label1_Click(object sender, EventArgs e)
        {
            Snake.Snake f1 = new Snake.Snake();
            f1.Show();
        }
        private void label2_Click(object sender, EventArgs e)
        {
        }
        private void Form2_Load(object sender, EventArgs e)
        {
            StreamReader sr = new StreamReader("Theme.WRProp");
            var checkTheme = sr.ReadToEnd();
            string s1 = "light";
            bool b = checkTheme.Contains(s1);
            sr.Close();
            if (b == true)
            {
                richTextBox1.ForeColor = Color.Black;
                richTextBox1.BackColor = Color.GhostWhite;
                label1.ForeColor = Color.Black;
                label1.BackColor = Color.GhostWhite;
                back.ForeColor = Color.Black;
                back.BackColor = Color.GhostWhite;
                StreamReader sr4 = new StreamReader("PearlDesign.WRProp");
                var pearlDesign = sr4.ReadToEnd();
                sr4.Close();
                string s9 = "true";
                bool b9 = pearlDesign.Contains(s9);
                if (b == true)
                {
                    pictureBox1.Image = (Image)Properties.Resources.ResourceManager.GetObject("ixeobg");
                }
                if (b == false)
                {
                    pictureBox1.Image = (Image)Properties.Resources.ResourceManager.GetObject("writenotebg");
                }
            }
        }

        private void back_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void backToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void richTextBox1_TextChanged(object sender, EventArgs e)
        {
        }

        private void richTextBox1_Click(object sender, EventArgs e)
        {
            Snake.Snake f1 = new Snake.Snake();
            f1.Show();
        }
    }
}
