<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Gawp
 */

?>
  </div><!--end .main-grid -->
	</div><!-- #content -->

	<footer id="colophon" class="site-footer flx">
		<div class="site-info">
			<a href="<?php echo esc_url( __( 'https://wordpress.org/', 'gawp' ) ); ?>">
				<?php
				/* translators: %s: CMS name, i.e. WordPress. */
				printf( esc_html__( 'Powered by %s', 'gawp' ), 'WordPress' );
				?>
			</a>
			<span class="sep"> | </span>
				<?php
				/* translators: 1: Theme name, 2: Theme author. */
				//set up logo path

				$logoPath = get_template_directory_uri(). "/img/gawp.png";
				//echo 'Theme: <a href="'.$logoPath .'" alt="Gawp">';
				printf( esc_html__( '%1$s by %2$s', 'gawp' ), '<img src="'.$logoPath.'" class="logo" alt="Gawp"> Theme', '<a href="http://korvin.org/">Korvin M Media</a>' );
				?>
		</div><!-- .site-info -->
  <div class="notice">
    Gawp: free software under the terms of the GNU General Public License
    <br><button><a href="http://github.com/korvinm">GET IT HERE</a></button>
    <br/>Example content &#169; Korvin M Media 2019.
  </div>
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
