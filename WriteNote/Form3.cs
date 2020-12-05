using System;
using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace WriteNote
{
    public partial class Form3 : Form
    {
        public Form3()
        {
            InitializeComponent();
        }

        private void label1_Click(object sender, EventArgs e)
        {
        }
        private void label2_Click(object sender, EventArgs e)
        {
        }
        private void Form3_Load(object sender, EventArgs e)
        {
            StreamReader sr = new StreamReader("Theme.WRProp");
            var checkTheme = sr.ReadToEnd();
            string s1 = "light";
            bool b = checkTheme.Contains(s1);
            sr.Close();
            if (b == true)
            {
                label1.ForeColor = Color.LightBlue;
                label1.Image = base.BackgroundImage;
                label1.BackColor = Color.Black;
                back.ForeColor = Color.Black;
                back.BackColor = Color.GhostWhite;
                button1.ForeColor = Color.Black;
                button1.BackColor = Color.GhostWhite;
                button2.ForeColor = Color.Black;
                button2.BackColor = Color.GhostWhite;
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
            StreamWriter sw = new StreamWriter("YesButton.WRProp");
            sw.Write("saveClose");
            sw.Close();
            this.Close();
        }

        private void backToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            StreamWriter sw = new StreamWriter("CancelButton.WRProp");
            sw.Write("cancelClose");
            sw.Close();
            this.Close();
        }
    }
}