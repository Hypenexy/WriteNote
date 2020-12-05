using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
                label1.BackColor = Color.GhostWhite;
                back.ForeColor = Color.Black;
                back.BackColor = Color.GhostWhite;
                button1.ForeColor = Color.Black;
                button1.BackColor = Color.GhostWhite;
                button2.ForeColor = Color.Black;
                button2.BackColor = Color.GhostWhite;
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
